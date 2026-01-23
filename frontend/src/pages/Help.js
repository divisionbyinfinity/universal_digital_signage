
import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

export default function Help() {
  const { configData } = useConfig();
  return (
    <div className="simple_body_font">
             <h3 class="text-lg mt-1 px-4">Division by Infinity</h3>
       <div className='mt-2 px-4 help_section'>
        <h2 class="text-xl mt-4">Universal Digital Signage</h2>
        <div class="mt-4">
        <p>This is a centralized digital signage solution that can be used to display content on any signage player device capable of displaying a web page. We use a custom Raspberry Pi build but you can use any device you choose.  Please visit <a className='text-black underline' href={configData?.github?.url}>{configData?.github?.text}</a> for more information and general instructions on how to use this server application.</p>
          <p class="k mt-4"><a class="gh_link"href={configData?.github?.url+"wiki"}>{configData?.github?.text || 'repository'}</a></p> 
          <p><a class="gh_link"href={configData?.github?.url+"issues"}>{configData?.github?.text}</a></p>
        </div>
      </div>
      {}
    </div>
  );
}
