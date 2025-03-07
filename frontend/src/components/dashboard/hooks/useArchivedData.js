import axios from 'axios';
import { ARCHIVED_DATA } from '../api/archiveddata';

export const getArchivedData = async (date) => {
    try {
        const response = await axios.get(ARCHIVED_DATA, { params: { date } });
        return response.data;
    } catch (error) {
        console.error(`Error searching transactions with keyword ${date}:`, error);
        return null;
    }
};