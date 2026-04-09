export default function GetStarted({ Title, Description, callback }) {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
            <div className="empty-state-panel enterprise-surface w-full max-w-4xl">
                <span className="status-badge">Empty library</span>
                <h1 className="text-center">{Title}</h1>
                <p className="text-center">{Description}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={callback} className="gradient-button">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}