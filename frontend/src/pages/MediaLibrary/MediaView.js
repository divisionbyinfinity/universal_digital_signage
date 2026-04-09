import * as React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

export default function MediaView({ user, mediaList, departments, selectCurrImg }) {
  const dephashmap = {};
  departments.forEach((dep) => {
    dephashmap[dep._id] = dep.name;
  });
  const checkDisabled = (item) => {
    if (user.role === 'standard' && user._id !== item.uploadedBy) {
      return true;
    }
    if (user.role === 'assetManager' && user.department?._id !== item?.department) {
      return true;
    }
    return false;
  };
 
  return (
    <div className="px-2 md:px-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {mediaList.length > 0 &&
          mediaList.map((item) => (
            <div key={item._id} className='flex items-center bg-slate-950 border border-slate-300/30 w-full h-56 justify-center relative rounded-2xl shadow-[0_16px_35px_rgba(15,23,42,0.16)] overflow-hidden'>
              <ImageListItem >
                <Link to={`/gallery/image/${item._id}`}>
                  {item.mediaType == 1 ? (
                    <img
                      srcSet={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                      src={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                      style={{ width: "100%", height: '100%', maxHeight:'14rem', objectFit: "cover" }}
                      alt={item?.mediaType}
                      loading="lazy"
                    />
                  ) : item.mediaType == 2 ? (
                    <video
                    src={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                    controls
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                  />
                  ) : (
                   <>
                     <img
                      src="https://via.placeholder.com/150" // Placeholder for unknown media types
                      className="object-cover h-40 w-60 rounded"
                      alt="Unknown Media"
                    />
                   </>
                  )}
                </Link>
                
                
              </ImageListItem>
              <Link to={`/gallery/image/${item._id}`}>
                  <ImageListItemBar
                    title={item.name}
                    subtitle={dephashmap[item.department] || "Global"}
                    sx={{
                      background: "linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.82) 100%)",
                      "& .MuiImageListItemBar-title": { fontWeight: 600 },
                    }}
                  />
                </Link>
                <IconButton
                  disabled={checkDisabled(item)}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: checkDisabled(item) ? '#cbd5e1' : '#334155',
                    color: checkDisabled(item) ? '#94a3b8' : '#f8fafc',
                    padding: 0,
                    minWidth: 0,
                    borderRadius: '0.7rem',
                  }}
                >
                  <CancelOutlinedIcon onClick={() => selectCurrImg(item)} />
                </IconButton>
            </div>
          ))}
      </div>
    </div>
  );
}