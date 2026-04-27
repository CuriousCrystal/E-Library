import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId })
      });
      if (res.ok) {
        setBooks(prev => prev.filter(b => b.id !== bookId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', background: 'linear-gradient(to right,#ec4899,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
          <Heart fill="#ec4899" color="#ec4899" /> My Wishlist
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Books you've saved to read later.</p>
      </div>

      {books.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <Heart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your wishlist is empty</p>
          <Link to="/catalog" className="btn">
            Explore Catalog <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.id} className="book-card glass">
              <div style={{ position: 'relative' }}>
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="book-cover" />
                ) : (
                  <div className="book-cover" style={{ background: 'linear-gradient(135deg,rgba(79,70,229,.4),rgba(192,132,252,.3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={48} color="#818cf8" />
                  </div>
                )}
                <button 
                  onClick={() => toggleFavorite(book.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}
                >
                  <Heart size={20} fill="#ec4899" color="#ec4899" />
                </button>
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <span className="book-author">{book.author}</span>
                <div style={{ marginTop: 'auto' }}>
                  <Link to="/catalog" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    View in Catalog
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
