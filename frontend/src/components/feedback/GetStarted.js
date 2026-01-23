export default function GetStarted({Title,Description,callback}) {

    return (
            <div className="flex justify-center items-center h-4/5 w-full rounded" >
                <div className="p-8 rounded w-2/3 text-center flex flex-col justify-center items-center gap-6" >
                    <h1 >{Title}</h1>
                    <p>{Description}</p>
                    <button onClick={callback} className="gradient-button">Get Started</button>
                </div>
            </div>
    )
}