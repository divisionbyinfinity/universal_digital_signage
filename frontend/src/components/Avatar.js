import Avatar from '@mui/material/Avatar';

function stringToColor(string) {
  // ... (unchanged)
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name?.split(' ').map((part) => part[0]).join(''),
  };
}

function MyAvatar({ name1, name2, imageUrl, sx  }) {
  const fullName = (name2 ? `${name1} ${name2}` : name1)?.toUpperCase();
  if (imageUrl) {
    // Display Avatar with image if imageUrl is provided
    return <Avatar alt={fullName} src={imageUrl} sx={sx} />;
  } else {
    // Display Avatar with initials and background color
    return <Avatar {...stringAvatar(fullName)} sx={sx} />;
  }
}

MyAvatar.defaultProps = {
  name2: '', // Set a default value for name2
  imageUrl: '', // Set a default value for imageUrl
};

export default MyAvatar;
