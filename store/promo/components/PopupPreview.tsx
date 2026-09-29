export const POPUP_ROOT_ID = 'popup-root';

export default function PopupPreview() {
    return (
        <div className="popup-preview">
            <div id={POPUP_ROOT_ID} />
        </div>
    );
}
