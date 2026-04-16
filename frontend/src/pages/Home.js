import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import GetStarted from "../components/feedback/GetStarted";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
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
      if (data.success) {
        setPlaylists(data.data);
      } else {
        setError(data.message || "Unable to load playlists.");
      }
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load playlists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatDateTime = (value) =>
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const resolveMedia = (playlist) => {
    const slideWithMedia = playlist.slides?.find((slide) => slide?.media);
    const media = slideWithMedia?.media;

    if (!media) {
      return null;
    }

    const mediaUrl = media.mediaUrl || media.url || "";
    const resolvedUrl = mediaUrl.startsWith("http")
      ? mediaUrl
      : `${process.env.REACT_APP_CDN_URL || ""}${mediaUrl}`;

    return {
      ...media,
      mediaType: Number(media.mediaType),
      resolvedUrl,
    };
  };

  const renderMediaPreview = (playlist) => {
    const firstSlide = resolveMedia(playlist);

    if (!firstSlide || !firstSlide.resolvedUrl) {
      return (
        <div className="flex h-full items-center justify-center bg-slate-900 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
          No preview available
        </div>
      );
    }

    if (firstSlide.mediaType === 1) {
      return (
        <img
          src={firstSlide.resolvedUrl}
          alt={playlist.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      );
    }

    if (firstSlide.mediaType === 2) {
      return (
        <video
          src={firstSlide.resolvedUrl}
          className="h-full w-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = 0.1;
          }}
        />
      );
    }

    return (
      <div className="flex h-full items-center justify-center bg-slate-900 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
        HTML preview
      </div>
    );
  };

  if (loading) {
    return (
      <div className="enterprise-page-shell">
        <div className="enterprise-list-body">
          <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
            <div className="enterprise-surface-strong overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-72 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                <div className="h-60 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
                  <div className="h-10 w-36 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enterprise-page-shell">
        <div className="enterprise-list-body">
          <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
            <div className="enterprise-surface-strong empty-state-panel">
          <span className="status-badge">Dashboard error</span>
          <h1>We could not load your playlists</h1>
          <p>{error}</p>
          <button onClick={fetchPlaylists} className="gradient-button">
            Try again
          </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const playlistCount = playlists.length;
  const totalSlides = playlists.reduce(
    (count, playlist) => count + (playlist.slides?.length || 0),
    0
  );

  if (playlists.length === 0) {
    return (
      <GetStarted
        Title="Get started with your signage library"
        Description="Build and launch branded playlists across screens, kiosks, and displays from one controlled workspace."
        callback={() => navigate("/playlist/create/standard")}
      />
    );
  }

  return (
    <div className="enterprise-page-shell page-backdrop">
      <div className="enterprise-list-body">
        <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
          <div className="enterprise-surface-strong overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="status-badge">Content operations</span>
              <h1 className="text-4xl font-semibold text-slate-950 md:text-5xl">
                Manage playlists with an enterprise control surface.
              </h1>
              <p className="max-w-2xl text-base text-slate-600">
                Monitor deployed playlists, inspect media previews, and launch content across your signage network with a cleaner operational view.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[34rem]">
              <div className="metric-card">
                <div className="metric-value">{playlistCount}</div>
                <div className="metric-label">Active playlists</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{totalSlides}</div>
                <div className="metric-label">Slides managed</div>
              </div>
              <div className="metric-card col-span-2 sm:col-span-1">
                <div className="metric-value">Live</div>
                <div className="metric-label">Platform status</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2 xl:grid-cols-3 lg:p-8">
          {playlists.map((playlist) => {
            const slideCount = playlist.slides?.length || 0;
            const firstSlide = resolveMedia(playlist);

            return (
              <div
                key={playlist._id}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.15)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  {renderMediaPreview(playlist)}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_40%),linear-gradient(180deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.22)_38%,rgba(2,6,23,0.88)_100%)]" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {slideCount} slides
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex max-w-full rounded-[22px] border border-white/15 bg-slate-950/72 px-4 py-3 shadow-[0_16px_40px_rgba(2,6,23,0.4)] backdrop-blur-md">
                      <div className="min-w-0 text-white">
                        <h2 className="truncate text-2xl font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                          {playlist.name}
                        </h2>
                        <p className="mt-2 text-sm text-white/75">
                          Created {formatDateTime(playlist.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="soft-chip">Playlist</span>
                    <span className="truncate font-medium text-slate-700">{playlist.name}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-900">{slideCount}</span> slides in this playlist
                    </div>
                    {firstSlide ? (
                      <span className="status-badge">Preview ready</span>
                    ) : (
                      <span className="status-badge">No preview</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={playlist.playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button-primary inline-flex items-center justify-center"
                    >
                      Open playlist
                    </a>
                    <span className="text-sm text-slate-500">Last updated {formatDateTime(playlist.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
