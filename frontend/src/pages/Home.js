import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import GetStarted from "../components/feedback/GetStarted";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "common/playlists/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.success) setPlaylists(data.data);
  };

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  if (playlists.length === 0) {
    return (
      <GetStarted
        Title="Get Started with Our Signage Solutions"
        Description="Elevate your brand with our powerful, easy-to-use digital signage platform. Seamlessly manage and display engaging content to capture your audience’s attention."
        callback={() => navigate("/playlist/create/standard")}
      />
    );
  }

  return (
    <div
      className="w-full min-h-screen px-10 py-12 bg-gray-100"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
 

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {playlists.map((playlist) => {
          const firstSlide = playlist.slides[0]?.media;

          return (
            <div
              key={playlist._id}
              className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              style={{ backgroundColor: "var(--bg-color-primary)" }}
            >
              {/* Media preview */}
              <div className="w-full h-64 sm:h-72 lg:h-80 relative overflow-hidden">
                {firstSlide ? (
                  firstSlide.mediaType == 1 ? (
                    <img
                      src={process.env.REACT_APP_CDN_URL + firstSlide.mediaUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : firstSlide.mediaType == 2 ? (
                    <video
                      src={process.env.REACT_APP_CDN_URL + firstSlide.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                      HTML Playlist Preview
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    No Preview Available
                  </div>
                )}
              </div>

              {/* Overlay info */}
              <div
                className="absolute bottom-0 left-0 w-full p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 bg-white bg-opacity-55"
              
              >
                <div>
                  <h2
                    className="text-xl font-bold uppercase"
                    style={{ color: "var(--text-primary-color)" }}
                  >
                    {playlist.name}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-description-color)" }}>
                    Created:{" "}
                    {new Date(playlist.createdAt).toLocaleDateString()}{" "}
                    {new Date(playlist.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <a
                  href={playlist.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-2 py-2 rounded-lg  shadow-md transition-colors duration-300"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-on-primary)",
                  }}
                >
                  Open Playlist
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
