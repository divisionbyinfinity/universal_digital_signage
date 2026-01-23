const BaseUrl=process.env.REACT_APP_API_URL
export async function heartbeatapi(token){
    const response = await fetch(BaseUrl+'heartbeat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+ token
        },
      });
      return response.json()
}
//Auth
export async function login(endpoint,email,password){
    const response = await fetch(BaseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    return  response.json()

} 

// Users

export async function registerUser(endpoint,token,formData){
  const response = await fetch(BaseUrl+endpoint, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      });

      const data = await response.json();
      return data
}

export async function editUser(endpoint, token, formData) {
  const response = await fetch(BaseUrl + endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      // DO NOT manually set Content-Type when using FormData
    },
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function deleteUser(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}




//departments  start

export async function getdepartments(endpoint,token){
    const response=await fetch(BaseUrl+endpoint,{
        method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization:'Bearer '+ token
            },
      })
      return response.json()
}
export async function adddepartment(endpoint,token,formData){

  const response = await fetch(BaseUrl+endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });

  const data = await response.json();
  return data
}
export async function deletedepartment(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}
// close departments 


// groups
export async function getgroups(endpoint,token){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
      },
    });
    return response.json()
}
export async function  addgroup(endpoint,token,hostObj){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(hostObj),
    });
    return response.json();
}
export async function  editgroup(endpoint,token,hostObj){
const response = await fetch(BaseUrl+endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(hostObj),
  });
  return response.json();
}
export async function deletegroup(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}
//TO DO: GROUP DISABLING API 
// export async function disablegroup(endpoint,token,id,data){
//   const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
//     method:'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization:'Bearer '+ token
//     },
//     body:JSON.stringify(data)
//   });
//   return response.json()
//   }

//tags

export async  function gettags(token){
  const response=await fetch(BaseUrl+'common/gallery/tags',{
      method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:'Bearer '+ token
          },
    })
    return response.json()
}

//

//hosts start
export async function gethosts(endpoint,token){
    const response = await fetch(BaseUrl+endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+ token
        },
      });
      return response.json()
}
export async function  addhost(endpoint,token,hostObj){
    const response = await fetch(BaseUrl+endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(hostObj),
      });
      return response.json();
}
export async function  edithost(endpoint,token,hostObj){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(hostObj),
    });
    return response.json();
}
export async function bulkUploadHost(endpoint,token,file){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: file,
    });
    return response.json();
}
//playlist start

export async function getplaylists(endpoint,token){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
      },
    });
    return response.json()
}
export async function ediplaylist(endpoint,token,playlistObj){
  const response=await fetch(BaseUrl+endpoint,{
      method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:'Bearer '+ token
          },
          body:JSON.stringify(playlistObj)
    })
    return response.json()
}
export async function cloneplaylist(endpoint,token,playlistObj){
  const response=await fetch(BaseUrl+endpoint,{
      method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:'Bearer '+ token
          },
          body:JSON.stringify(playlistObj)
    })
    return response.json()
}




export async function assignHost(endpoint,token,hostObj){
  const response=await fetch(BaseUrl+endpoint,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
    body:JSON.stringify(hostObj)
  })
  return response.json();
}
export async function deleteHost(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}
// channels
//hosts start
export async function getchannels(endpoint,token){

  const response = await fetch(BaseUrl+endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
      },
    });
    return response.json()
}
export async function  addchannels(endpoint,token,hostObj){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(hostObj),
    });
    return response.json();
}

export async function deletechannel(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}
export async function  editchannel(endpoint,token,channelObj){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(channelObj),
    });
    return response.json();
}
// host end

//playlist start
export async function assignplaylist(endpoint,token,data){
  const response=await fetch(BaseUrl+endpoint,{
      method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:'Bearer '+ token
          },
          body:data
    })
  return response.json()
}

export async function assignChannel(endpoint,token,hostObj){
const response=await fetch(BaseUrl+endpoint,{
  method:'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization:'Bearer '+ token
  },
  body:JSON.stringify(hostObj)
})
return response.json();
}
export async function deletePlaylist(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()


}



//schedulers
export async function createschedule(endpoint,data,token){
  const response=await fetch(BaseUrl+endpoint,{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
      Authorization:'Bearer '+token
    },
    body:JSON.stringify(data)

  })
  return response.json()
}
//schedulers
export async function editschedule(endpoint,data,token){
  const response=await fetch(BaseUrl+endpoint,{
    method:"PUT",
    headers:{
      'Content-Type':'application/json',
      Authorization:'Bearer '+token
    },
    body:JSON.stringify(data)

  })
  return response.json()
}
export async function getschedulers(endpoint,token){
  const response = await fetch(BaseUrl+endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
      },
    });
    return response.json()
}
export async function getMinschedulers(query,token){
  const response = await fetch(BaseUrl+'common/schedules/min', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
      },
    });
    console.log(response)
    return response.json()
}

export async function deleteScheduler(endpoint,token,id){
  const response=await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
  })
  return response.json()

}

export async function editmedia(endpoint,token){
  const data=fetch(BaseUrl+endpoint,{
    method:'PUT',
    headers:{
      Authorization:`Bearer ${token}`
    },
  }).then(res=>res.json())
  return data
}
export async function getmedia(endpoint, token, query={}) {
  const baseEndpoint = process.env.REACT_APP_API_URL + endpoint;
  const queryObj={};
  if(query.currentPage){
    queryObj.page=query.currentPage
  }
  if(query.currentDept){
    queryObj.department=query.currentDept?._id
  }
  if(query.tag){
    queryObj.tag=query.tag
  }
  const queryString = `${baseEndpoint}?${new URLSearchParams(queryObj)}`;
  const data = await fetch(queryString, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return data;
}
//Admin apis
// lock unlock:-
export async function disbalehost(endpoint,token,id,data){
const response = await fetch(BaseUrl+`${endpoint}/${id}`,{
  method:'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization:'Bearer '+ token
  },
  body:JSON.stringify(data)
});
return response.json()
}

export async function disablePlaylist(endpoint,token,id,data){
  const response = await fetch(BaseUrl+`${endpoint}/${id}`,{
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization:'Bearer '+ token
    },
    body:JSON.stringify(data)
  });
  return response.json()
  }

  export async function getusers(endpoint,token){
    const response = await fetch(BaseUrl+endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+ token
        },
      });
      return response.json()
  }
  export async function createPlaylist(dataobj,token){
    const endpoint=BaseUrl+'common/playlists/create';
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Add content type header
      },
      body: JSON.stringify(dataobj),
    });
    return res.json()
  }

  export async function editPlaylist(dataobj,token,id){
    console.log(dataobj)
    const endpoint=BaseUrl+`common/playlists/edit/${id}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Add content type header
      },
      body: JSON.stringify(dataobj),
    });
    return res.json()
  }

  export async function createplaylistkisok(data,token){
    const endpoint=BaseUrl+'common/playlists/kisok/create';
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:'Bearer '+token
      },
      body:JSON.stringify(data)
    })
    return response.json()
  }
  export async function editplaylistkisok(data,id,token){
    const endpoint=BaseUrl+`common/playlists/kisok/edit/${id}`;
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:'Bearer '+token
      },
      body:JSON.stringify(data)
    })
    return response.json()
  }
  export async function slideedit(data,id,token){
    const endpoint=BaseUrl+`common/playlists/kisok/edit/${id}`;
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:'Bearer '+token
      },
      body:JSON.stringify(data)
    })
    return response.json()
  }
  export async function cloneplaylistkisok(data,token){
    const endpoint=BaseUrl+'common/playlists/kisok/clone/${id}';
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:'Bearer '+token
      },
      body:JSON.stringify(data)
    })
    return response.json()
  }
  export async function getplaylistbyid(id,token){
    const response = await fetch(BaseUrl+`common/playlists/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+ token
        },
      });
      return response.json()
  }
