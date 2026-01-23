import * as React from 'react';
import Button from '@mui/material/Button';
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
    <div className="px-4">
      <div className="flex flex-wrap gap-6 mr-0">
        {mediaList.length > 0 &&
          mediaList.map((item) => (
            <div key={item._id} className='flex items-center bg-black w-80 h-52 justify-center relative rounded'>
              <ImageListItem >
                <Link to={`/gallery/image/${item._id}`}>
                  {item.mediaType == 1 ? (
                    <img
                      srcSet={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                      src={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                      style={{
                      maxWidth: "300px",
                      height: 'auto',
                      maxHeight:'12rem'
                      }}
                      alt={item?.mediaType}
                      loading="lazy"
                    />
                  ) : item.mediaType == 2 ? (
                    <video
                    src={`${process.env.REACT_APP_CDN_URL}${item?.mediaUrl}`}
                    controls
                    loading="lazy"
                    style={{
                      width: "300px",
                      objectFit: "cover",
                      borderRadius: "5px",
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
                    className="bg-black bg-opacity-50 text-white rounded"
                  />
                </Link>
                <IconButton
                  disabled={checkDisabled(item)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: checkDisabled(item) ? 'gray' : 'green',
                    color: checkDisabled(item) ? '#aaa' : 'white',
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