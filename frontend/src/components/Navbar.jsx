import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { user, signout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const lastY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastY.current || currentY < 90);
      setScrolled(currentY > 90);
      lastY.current = currentY;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignout = () => { signout(); navigate('/login'); };

  // Estilos dos ícones sol/lua — replica a animação do portfólio
  const sunStyle = {
    position: 'absolute',
    fontSize: 22,
    transition: 'opacity .5s, transform .5s',
    opacity: dark ? '0' : '1',
    transform: dark ? 'scale(0) rotate(90deg)' : 'scale(1) rotate(-46deg)',
  };

  const moonStyle = {
    position: 'absolute',
    fontSize: 22,
    transition: 'opacity .5s, transform .5s',
    opacity: dark ? '1' : '0',
    transform: dark ? 'scale(1) rotate(-15deg)' : 'scale(0) rotate(-180deg)',
  };

  return (
    <nav style={{
      top: visible ? '0' : '-90px',
      height: '90px',
      position: 'sticky',
      zIndex: 10,
      transition: 'top .2s, background-color .4s',
      backgroundColor: scrolled
        ? dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
    }}>
      <Link to="/" style={{ color: 'var(--text)', font: '22px justsans', textDecoration: 'none' }}>
        SCAFFALE
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/my-books" style={{ color: 'var(--text)', font: '18px justsans', textDecoration: 'none' }}>
          Estante
        </Link>
        <Link to="/profile" style={{ color: 'var(--text)', font: '18px justsans', textDecoration: 'none' }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            : user?.name}
        </Link>
        <button onClick={handleSignout} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', font: '16px justsans'
        }}>
          Sair
        </button>
        <button onClick={toggle} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', width: 28, height: 28,
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <i className="fas fa-sun" style={sunStyle}></i>
          <i className="fas fa-moon" style={moonStyle}></i>
        </button>
      </div>
    </nav>
  );
}
