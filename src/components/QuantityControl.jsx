import PropTypes from 'prop-types';
export default function QuantityControl({ quantity, onDecrease, onIncrease, limit }) { return <div className="quantity" aria-label="Quantity controls"><button onClick={onDecrease} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={onIncrease} disabled={quantity >= limit} aria-label="Increase quantity">+</button></div>; }
QuantityControl.propTypes = { quantity: PropTypes.number.isRequired, onDecrease: PropTypes.func.isRequired, onIncrease: PropTypes.func.isRequired, limit: PropTypes.number.isRequired };
