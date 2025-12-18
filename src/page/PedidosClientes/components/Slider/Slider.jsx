import "../../../../scss/styles.scss";

function Slider(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    return (
        <>
            <div className="slider-frame">
                <iframe
                    src="https://www.youtube.com/embed/ODOS-pPZF58" width="600" height="350">
                </iframe>
            </div>
        </>
    );
}

export default Slider;
