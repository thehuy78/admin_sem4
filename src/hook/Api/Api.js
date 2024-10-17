import axios from 'axios';


const urlApi = "https://localhost:7229/api/";

export const apiRequestForm = async (method, uri, data = null) => {
    try {
        const config = {
            method: method,
            url: urlApi + uri,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: data
        };

        const response = await axios(config);
        return response;
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
};

export const apiRequest = async (method, uri, data = null) => {
    try {
        const config = {
            method: method,
            url: urlApi + uri,
            headers: {
                "Content-Type": "application/json",
            },
            data: data
        };

        const response = await axios(config);
        return response;
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
};


export default apiRequestForm;
