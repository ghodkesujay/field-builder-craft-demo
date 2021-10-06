const PostService = async(data) => {
    console.log(data.items);
    const res = await fetch("http://www.mocky.io/v2/566061f21200008e3aabd919", {
        method: 'POST',
        body: JSON.stringify({label: data.label,
        required: data.required,
        choices: data.items,
        displayAlpha: data.sortOptions,
        default: data.defaultItem
        }),
        headers: {
            "content-type": "application/json"
        }
    });

    return await res.json();
}

export default PostService;
