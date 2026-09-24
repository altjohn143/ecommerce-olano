import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
export default function Header({ itemCount }) {
  return <header className="site-header"><NavLink className="brand" to="/"><span>luna</span>market</NavLink><nav aria-label="Main navigation"><NavLink to="/">Shop</NavLink><NavLink to="/cart">Cart <b>{itemCount}</b></NavLink><NavLink to="/checkout">Checkout</NavLink></nav></header>;
}
Header.propTypes = { itemCount: PropTypes.number.isRequired };
