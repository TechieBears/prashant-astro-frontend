
const ItemDots = ({ name, len }) => {
    return name?.length > len ? name?.slice(0, len) + "..." : name

}

export default ItemDots