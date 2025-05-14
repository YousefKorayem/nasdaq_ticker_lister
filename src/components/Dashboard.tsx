import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { restClient } from '@polygon.io/client-js';

const rest = restClient(
        "Z0XFAJcBFzm5wRbRe1ND12achddy_wsi",
        "https://api.polygon.io",
        { pagination: false }
    );

const Dashboard: React.FC = () => {
    const [tickers, setTickers] = useState<{ name: string; ticker: string }[]>([]);
    const nextUrlRef = useRef<string | null>(null);

    const fetchNextTickers = async () => {
        try {
            let data;

            if(nextUrlRef.current){
                const url = new URL(nextUrlRef.current);
                if(!url.searchParams.has("apiKey")){
                    url.searchParams.append("apiKey", "Z0XFAJcBFzm5wRbRe1ND12achddy_wsi");
                }
                const response = await axios.get(url.toString());
                data = response.data;
            } else{
                data = await rest.reference.tickers({
                    market: "stocks",
                    exchange: "XNAS",
                    active: "true",
                    order: "asc",
                    limit: 12,
                    sort: "ticker"
                });
            }

            const results = data.results || [];

            const newTickers = results.map((item: any) => ({
                ticker: item.ticker,
                name: item.name
            }))

            setTickers(prev => [...prev, ...newTickers]);

            nextUrlRef.current = data.next_url || null;

        } catch (error) {
            console.error("Error fetching paged tickers:", error);
        }
    }

    useEffect(() => {
            fetchNextTickers();
    }, []);

    return(
        <div className="d-flex flex-column vh-100">
            {/* Header*/}
            <header className="bg-primary text-white p-3">
                <div className="container d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search for a stock..."
                    />
                </div>
            </header>

            {/* Grid Container */}
            <main className="flex-grow-1 overflow-auto">
                <div className="container py-4" style={{ height: '75vh', overflowY: 'auto' }}>
                    <div className="row">
                        {tickers.map((stock, index) => (
                            <div className="col-md-3 col-sm-6 mb-4" key={index}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{stock.name}</h5>
                                         <p className="card-text text-muted">{stock.ticker}</p>
                                    </div>
                                </div>
                            </div>
                        ))} 
                    </div>

                    {/* Load More Button */}
                    <div className="text-center mt-4">
                        <button onClick={fetchNextTickers} className="btn btn-outline-primary">
                            Load More
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
	