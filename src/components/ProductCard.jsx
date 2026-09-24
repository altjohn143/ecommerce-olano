import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
export default function ProductCard({ product, onAdd, cartQuantity }) {
 return <article className="product-card"><Link to={`/products/${product.id}`} className="product-image"><img src={product.image} alt={product.name}/>{product.featured && <em>New arrival</em>}</Link><div className="product-copy"><p>{product.category}</p><h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3><div className="card-bottom"><strong>₱{product.price.toLocaleString()}</strong><button onClick={() => onAdd(product)} disabled={cartQuantity >= product.stock}>{cartQuantity >= product.stock ? 'Max in cart' : 'Add +'}</button></div></div></article>;
}
ProductCard.propTypes = { product: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired, category: PropTypes.string.isRequired, price: PropTypes.number.isRequired, image: PropTypes.string.isRequired, featured: PropTypes.bool }).isRequired, onAdd: PropTypes.func.isRequired, cartQuantity: PropTypes.number.isRequired };
