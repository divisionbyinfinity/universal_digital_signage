  import { useNavigate, useParams } from 'react-router-dom';
  import { getmedia } from '../../apis/api';
  import { useState, useEffect } from 'react';
  import TextField from '@mui/material/TextField';
  import Button from '@mui/material/Button';
  import { editmedia } from '../../apis/api';
  import { useAuth } from '../../contexts/AuthContext';
  import { useAlert } from '../../contexts/AlertContext';
  const DisplayTextField = ({ label, value }) => (
    <TextField
      id="standard-read-only-input"
      label={label}
      value={value}
      InputProps={{
        readOnly: true,
      }}
      fullWidth
      variant="standard"
    />
  );

  const EditableTextField = ({ label, name, value, onChange, multiline = false }) => (
    <TextField
      label={label}
      name={name}
      multiline={multiline}
      value={value}
      onChange={onChange}
      fullWidth
      focused
      maxRows={multiline ? 4 : undefined}
      variant="standard"
    />
  );
  export default function Media() {
    const { user } = useAuth();
    const addAlert = useAlert();
    const { imageId } = useParams();
    const [media, setMedia] = useState(null);
    const [formData, setFormData] = useState({ name: '', tags: '' });
    const [loading, setLoading] = useState(true);


    const fetchMedia = async () => {
      try {
        const data = await getmedia(`common/gallery/${imageId}`, user.token);
        if (data.success) {
          setMedia({ ...data.data, name: data.data.name, tags: data.data.tags });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media:', error);
        setLoading(false);
      }
    };
    const handleSubmit=async ()=>{
      try{
      const res=await editmedia('common/gallery/'+media._id+`?name=${formData.name}&tags=${formData.tags}`,user.token);
      if (res.success){
        addAlert({ type: 'success', message:res.message });
        fetchMedia();
      }
      else{
        addAlert({ type: 'error', message:res.message });

      }
    }
      catch(err){
        addAlert({ type: 'error', message:'cannot edit the image' });

      }
    }
    useEffect(() => {
      if (imageId) {
        fetchMedia();
      } else {
        setLoading(false);
      }
    }, [imageId]);

    useEffect(()=>{
      if(media){
        setInitialdata()
      }
    },[media])

    const handleImageEdit = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
    const setInitialdata=() => {setFormData({ name: media.name, tags: media.tags }); }

    return (
      <div>
        {media !== null && (
          <div className="w-full flex p-2 py-6 border">
            <div className="w-1/2">
              {
                media.mediaType == 1 ? (
                  <img src={`${process.env.REACT_APP_CDN_URL}${media?.mediaUrl}`} style={{maxWidth:'90%',height:'auto'}} className='rounded' />
                ) : media.mediaType == 2 ? (
                  <video
                    src={`${process.env.REACT_APP_CDN_URL}${media?.mediaUrl}`}
                    controls
                    loading="lazy"
                    className="shadow-xl rounded"
                    style={{maxWidth:'90%',height:'auto'}}
                    onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/150" // Placeholder for unknown media types
                    className="object-cover w-90 h-auto rounded"
                    alt="Unknown Media"
                  />
                )
              }
            </div>
            <div className="flex flex-col gap-2 justify-between p-2 w-1/2">
              <div className="flex gap-2">
                <EditableTextField label="Name" name="name" value={formData.name} onChange={handleImageEdit}  />
                <DisplayTextField label="Size" value={media.size} />
              </div>
              <EditableTextField label="Tags" name="tags" value={formData.tags} onChange={handleImageEdit} multiline />
              <div className="flex gap-2">
                <DisplayTextField label="Created At" value={media.createdAt} />
                <DisplayTextField label="Updated At" value={media.updatedAt} />
              </div>

              <div className="flex justify-between">
                <Button variant="outlined" disabled={media.name === formData.name && media.tags === formData.tags} color="error" onClick={setInitialdata}>
                  Cancel
                </Button>
                <Button variant="contained" disabled={media.name === formData.name && media.tags === formData.tags} color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }
