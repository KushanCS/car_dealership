import React from 'react';
import AIPredictor from '../components/AIPredictor';

export default function AIPredictionPage() {
  return (
    <div className="page">
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "40px 20px 56px" }}>
        <div className="pageHead" style={{ marginBottom: "20px" }}>
          <div>
            <div className="pageTitle" style={{ fontSize: "30px" }}>AI Price Prediction</div>
          </div>
        </div>
        <AIPredictor />
      </section>
    </div>
  );
}
