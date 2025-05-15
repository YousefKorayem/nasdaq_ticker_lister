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
    const [loading, setLoading] = useState(false); // Track if data is being loaded
    const [searchQuery, setSearchQuery] = useState('');
    const [lastSearch, setLastSearch] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const nextUrlRef = useRef<string | null>(null);

    const fetchNextTickers = async () => {
        if (loading) return; // Prevent multiple requests
        setLoading(true);
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

            setTickers(prev => {
                const updated = [...prev, ...newTickers];
                sessionStorage.setItem("cachedTickers", JSON.stringify(updated));
                sessionStorage.setItem("cachedNextUrl", data.next_url || "");
                return updated;
            });

            nextUrlRef.current = data.next_url || null;

            setLoading(false);

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                console.warn("Rate limit hit. Retrying in 60 seconds...");
                // Do NOT set loading to false so the spinner remains visible
                setTimeout(fetchNextTickers, 60000);
            } else {
                setLoading(false);
            }
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const bottom = e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
        if(bottom && !loading && !searchMode) {
            fetchNextTickers();
        }
    };

    const searchStocks = async (query: string) => {
        setSearchMode(true);
        setLoading(true);
        if(!query) {}
        try{
            const res = await rest.reference.tickers({
                search: query,
                market: 'stocks',
                exchange: 'XNAS',
                active: 'true',
                order: 'asc',
                limit: 12,
                sort: 'ticker'
            });

            const results = res.results || [];

            const formatted = results.map((item: any) => ({
                ticker: item.ticker,
                name: item.name
            }))

            setTickers(formatted);
            nextUrlRef.current = null;
            setLoading(false);
        } catch (error: any) {
            if(error.status === 'ERROR') {
                console.warn("Rate limit hit. Retrying in 45 seconds...");
                setTimeout(() => searchStocks(query), 45000);
                return;
            }
            else{
                console.error("Search error:", error);
                setLoading(false);
            }

        }
    };

    useEffect(() => {
        const cachedTickers = sessionStorage.getItem("cachedTickers");
        const cachedNextUrl = sessionStorage.getItem("cachedNextUrl");
        if(cachedTickers && !loading) {
            setTickers(JSON.parse(cachedTickers));
            nextUrlRef.current = cachedNextUrl || null;
        }
        else{
            fetchNextTickers();
        }
    }, []);

    useEffect(() => {
        const trimmed = searchQuery.trim();

        const delayDebounce = setTimeout(() => {

            if(trimmed === '') {
                if(lastSearch !== ''){
                    setLastSearch('');
                    setTickers([]);
                    nextUrlRef.current = null;
                    setSearchMode(false);
                    fetchNextTickers();
                }
                return;
            }

            if(trimmed !== lastSearch) {
                setLoading(true);
                searchStocks(trimmed);
                setLastSearch(trimmed);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery])

    return(
        <div className="d-flex flex-column vh-100">
            {/* Header*/}
            <header className="bg-dark p-3">
                <div className="container d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control bg-light text-dark w-50"
                        placeholder="Search for a stock..."
                        value = {searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Grid Container */}
            <main className="flex-grow-1 overflow-auto bg-black text-light p-3">
                <div 
                    className="container py-4"
                    style={{ height: '75vh', overflowY: 'auto' }}
                    onScroll={handleScroll}    
                >
                    <div className="row">
                        {tickers.length > 0 ? (
                            tickers.map((stock, index) => (
                                <div className="col-6 col-md-3 col-sm-6 mb-4" key={index}>
                                    <div className="card h-100 bg-dark text-light shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">{stock.name}</h5>
                                            <p className="card-text">{stock.ticker}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div
                                    className="col-6 col-md-3 col-sm-6 mb-4"
                                    style={{ visibility: 'hidden' }}
                                    key={`placeholder-${idx}`}
                                >
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">Placeholder</h5>
                                            <p className="card-text">Ticker</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    } 
                    </div>

                    {/* Load More Button */}
                    {/* <div className="text-center mt-4"> */}
                        {/* <button onClick={fetchNextTickers} className="btn btn-outline-primary"> */}
                            {/* Load More */}
                        {/* </button> */}
                    {/* </div> */}

                    {/* Loading Spinner */}
                    {loading && !searchMode && (
                        <div className="text-center mt-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only"></span>
                        </div>
                        </div>
                    )}  

                    {/* Searching Spinner */}
                    {loading && searchMode && (
                        <div className="text-center mt-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only"></span>
                        </div>
                        </div>
                    )} 
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
	