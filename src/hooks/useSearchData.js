import { useState, useEffect } from 'react';
import getTourDestination from "@/services/getTourDestination";
import getCountries from '@/services/visa/getCountries';
import getActivitiesDestinations from '@/services/Activities/getTourDestinations';
import getTourDestinations from '@/services/packages/getTourDestinations';

export const useSearchData = (dataSource) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let result;

                switch (dataSource) {
                    case 'tour':
                        result = await getTourDestinations();
                        setData(result || []);
                        break;
                    case 'activities':
                        result = await getActivitiesDestinations();
                        setData(result || []);
                        break;
                    case 'ships':
                        result = await getTourDestination();
                        if (result?.success) {
                            const filteredData = result.data.filter(item =>
                                item.isShow === "yes" || item.isShow === undefined
                            ) || [];
                            setData(filteredData);
                        }
                        break;

                    case 'visa':
                        result = await getCountries();
                        const countriesData = result.data || [];
                        setData(countriesData);
                        break;

                    case 'hotel':
                        break;

                    default:
                        setData([]);
                }
            } catch (err) {
                setError(`Failed to load ${dataSource} data`);
                console.error(`Error loading ${dataSource} data:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataSource]);

    return { data, loading, error };
};