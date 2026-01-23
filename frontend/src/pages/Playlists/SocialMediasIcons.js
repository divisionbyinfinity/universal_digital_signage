import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InterestsIcon from '@mui/icons-material/Interests';
import { useEffect } from 'react';
import React from 'react'

const socialMediaListIcons={
    linkedIn:LinkedInIcon,
    instagram:InstagramIcon,
    facebook:FacebookIcon,
    XIcon:XIcon,
    youtube:YouTubeIcon,
    interests:InterestsIcon
}


function SocialMediasIcons({socialMedialist,iconColor,iconSize}) {
    
  return (
    <div className='flex gap-2'>
        {socialMedialist?.map((socialMedia,index)=>{
            const Icon=socialMediaListIcons[socialMedia.name]
            return <Icon fontSize={iconSize}  style={{color:iconColor}} key={index} />
        })}
    </div>
  )
}

export default SocialMediasIcons