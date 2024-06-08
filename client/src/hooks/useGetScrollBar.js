import {useEffect, useState} from "react";

const useGetScrollBar = () => {
    const [scrollBar, setScrollBar] = useState(0);
    useEffect(() => {
        const body = document.querySelector('body');
        const check = () => {
            if (body.clientHeight > window.innerHeight) {
                setScrollBar(window.innerWidth - body.clientWidth)
            }
            else setScrollBar(0)
        };
        setTimeout(check, 0);
    }, []);
    return scrollBar;
}
export default useGetScrollBar;