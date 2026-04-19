import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const initialMenu = [
  { id: 1, name: 'Truffle Burger', price: '0.005', desc: 'Wagyu beef top with black truffle', category: 'Mains', available: true },
  { id: 2, name: 'Loaded Fries', price: '0.002', desc: 'Crispy fries with cheese and bacon', category: 'Sides', available: true },
  { id: 3, name: 'Vegan Bowl', price: '0.004', desc: 'Quinoa, roasted veggies, tahini dressing', category: 'Mains', available: false },
];

const MenuManagementPage = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState(initialMenu);

  const toggleAvailability = (id) => {
    setMenuItems(items => items.map(item => item.id === id ? { ...item, available: !item.available } : item));
    toast.success("Menu item status updated");
  };

  const deleteItem = (id) => {
    setMenuItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from menu");
  };

  return (
    <div className="page-container menu-management-page">
      <div className="header glass-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="header-title" style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white' }}>Menu</h1>
        </div>
        <button style={{ background: '#E63946', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px' }}>
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="content-scroll" style={{ padding: '20px', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {menuItems.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>{item.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>{item.desc}</p>
                </div>
                <div style={{ background: 'rgba(0,255,240,0.1)', color: '#00FFF0', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
                  {item.price} ETH
                </div>
              </div>
              
              <div style={{ margin: '12px 0', height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  <input type="checkbox" checked={item.available} onChange={() => toggleAvailability(item.id)} style={{ accentColor: '#E63946', width: '16px', height: '16px' }} />
                  Available Today
                </label>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer' }} onClick={() => toast.info('Edit modal coming soon')}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: '#ff4757', padding: '6px', cursor: 'pointer' }} onClick={() => deleteItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagementPage;
