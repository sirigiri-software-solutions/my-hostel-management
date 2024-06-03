export const FetchData = async () => {
    try {
        const response = await fetch('https://kiranreddy-58a8c-default-rtdb.firebaseio.com/Hostel.json');
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};