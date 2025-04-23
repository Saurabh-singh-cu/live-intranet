import React, { useEffect } from 'react'

import apiClient from '../../../config/apiClient';

const Cluster = () => {

    const getCluster = async() => {
        try{
            const response = await apiClient.get("/clusters/");
            console.log(response, "UU");
        }catch(error) {
            console.error("Error fetching clusters:", error);
        }
    }

    useEffect(() => {
        getCluster()
    }, []);



  return (
    <div>Cluster</div>
  )
}

export default Cluster