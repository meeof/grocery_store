import {useEffect, useState} from "react";

const useGetScrollBar = () => {
    let [scrollBar, setScrollBar] = useState(0);
    useEffect(() => {
        let body = document.querySelector('body');
        const handleResize = () => {
            if (body.clientHeight > window.innerHeight) {
                setScrollBar(window.innerWidth - body.clientWidth)
            }
            else setScrollBar(0)
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return scrollBar;
}
export default useGetScrollBar;