print("🚀 Mongo Init Started");

function env(name) {
  if (process.env && process.env[name]) {
    return process.env[name];
  }
  throw new Error("❌ Missing env var: " + name);
}

const APP_USER = env("MONGO_APP_ADMIN");
const APP_PWD  = env("MONGO_APP_ADMIN_PWD");

/* Switch DB */
db = db.getSiblingDB("signage");

/* Create app user (idempotent) */
if (!db.getUser(APP_USER)) {
  db.createUser({
    user: APP_USER,
    pwd: APP_PWD,
    roles: [
      { role: "readWrite", db: "signage" },
      { role: "dbAdmin", db: "signage" }
    ]
  });
}

/* ------------------------------------------------------------
   Create collections with schema validation (idempotent)
------------------------------------------------------------ */
function ensureCollection(name, options) {
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name, options);
    print(`📁 Created collection: ${name}`);
  } else {
    print(`ℹ️ Collection '${name}' already exists — skipping`);
  }
}

ensureCollection("departments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          description: "Department name is required"
        },
        createdBy: {
          bsonType: "objectId",
          description: "User who created the department"
        }
      }
    }
  }
});

ensureCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "firstName",
        "lastName",
        "email",
        "password",
        "role",
        "departmentName"
      ],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        bio: { bsonType: "string" },
        role: {
          bsonType: "string",
          enum: ["standard", "admin", "assetManager", "globalAssetManager"]
        },
        departmentName: { bsonType: "string" },
        departmentId: { bsonType: "objectId" },
        profileImg: { bsonType: "string" }
      }
    }
  }
});

/* ------------------------------------------------------------
   Seed default department (idempotent)
------------------------------------------------------------ */
let department = db.departments.findOne({ name: "General" });

if (!department) {
  print("🏢 Inserting default department: General");
  const result = db.departments.insertOne({ name: "General" });
  department = { _id: result.insertedId, name: "General" };
} else {
  print("ℹ️ Department 'General' already exists");
}

/* ------------------------------------------------------------
   Seed initial admin user (idempotent)
------------------------------------------------------------ */
const ADMIN_EMAIL = "admin@uds";

let adminUser = db.users.findOne({ email: ADMIN_EMAIL });

if (!adminUser) {
  print("👤 Inserting initial admin user");

  const userResult = db.users.insertOne({
    firstName: "Full",
    lastName: "Administrator",
    email: ADMIN_EMAIL,
    password: "$2a$10$lpR7ZoS0NDAKUmQuRth8SOrmh0xor5C/k/8MtfkI4Un.L1b5evoyW",
    bio: "Software Developer",
    role: "admin",
    departmentName: department.name,
    departmentId: department._id
  });

  adminUser = { _id: userResult.insertedId };

  db.departments.updateOne(
    { _id: department._id },
    { $set: { createdBy: adminUser._id } }
  );
} else {
  print("ℹ️ Admin user already exists — skipping");
}

/* ------------------------------------------------------------
   Final verification logs
------------------------------------------------------------ */
print("✅ MongoDB Initialization Completed Successfully");
print("📂 Departments:");
printjson(db.departments.find().toArray());

print("👥 Users:");
printjson(db.users.find().toArray());
