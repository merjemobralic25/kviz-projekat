import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const localQuizzes = [
  {
    "id": "1",
    "title": "Opće znanje",
    "description": "Testirajte svoje opće znanje iz različitih oblasti.",
    "category": "Opće znanje",
    "difficulty": "Srednje",
    "timeLimit": 45,
    "questionsCount": 5
  },
  {
    "id": "2",
    "title": "Nauka i tehnologija",
    "description": "Koliko znate o najnovijim dostignućima nauke i tehnologije?",
    "category": "Nauka",
    "difficulty": "Teško",
    "timeLimit": 60,
    "questionsCount": 4
  },
  {
    "id": "3",
    "title": "Geografija svijeta",
    "description": "Putujte kroz kontinente i testujte svoje znanje geografije.",
    "category": "Geografija",
    "difficulty": "Lako",
    "timeLimit": 30,
    "questionsCount": 3
  }
];

const QuizzesPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Sve');

  const filteredQuizzes = localQuizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Sve' || q.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-wrapper" style={{ padding: '100px var(--space-lg) 40px' }}>
      <div className="container">
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 12 }}>Dostupni Kvizovi</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Izaberite temu i testirajte svoje znanje!</p>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Pretraži kvizove..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', maxWidth: 300, width: '100%' }}
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            <option value="Sve">Sve kategorije</option>
            <option value="Opće znanje">Opće znanje</option>
            <option value="Nauka">Nauka</option>
            <option value="Geografija">Geografija</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="card" style={{ background: 'var(--color-surface)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-primary">{quiz.category}</span>
                  <span className={`badge ${quiz.difficulty === 'Lako' ? 'badge-success' : quiz.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>{quiz.difficulty}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{quiz.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>{quiz.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                 <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>⏱ {quiz.timeLimit}s</span>
                
                <Link to={`/quizzes/${quiz.id}`} className="btn btn-accent btn-sm">Započni ⚡</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;