function Button(props: any) {
    return (
        <div>
            <button className="hover:bg-blue-100 rounded border-2 py-2 px-4 block mx-auto mt-5" onClick={props.onClick}>{props.text}</button>
        </div>
    )
}

export default Button