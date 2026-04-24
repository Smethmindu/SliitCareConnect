/**
 * MEMBER 1: Auth & User Management
 * STUDENT PROFILE PAGE
 * This page displays the authenticated student's personal details, 
 * retrieved from browser storage after a successful login.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, UserIcon, CreditCardIcon as IdCardIcon, ShieldCheckIcon } from 'lucide-react';

export function StudentProfile() {
  const [user, setUser] = useState(null);

  /**
   * INITIAL LOAD
   * We pull the user object from localStorage (or sessionStorage) 
   * to display current account details without an extra API call.
   * This ensures the profile loads instantly for a better user experience.
   */
  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#78716c", fontSize: "1.125rem" }}>Loading profile details...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Construct full name securely
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'Student';
  const roleDisplay = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student';
  const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'S';

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 4rem)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            marginBottom: '2rem'
          }}
        >
          {/* Banner */}
          <div style={{ height: '8rem', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}></div>
          
          <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
            {/* Avatar Profile Bubble */}
            <div style={{
              width: '8rem',
              height: '8rem',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              marginTop: '-4rem',
              marginBottom: '1rem',
              border: '4px solid white'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#0284c7'
              }}>
                {initials}
              </div>
            </div>

            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.875rem', fontWeight: 700, color: '#1c1917' }}>
              {fullName}
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheckIcon size={16} color="#10b981" />
              Verified {roleDisplay}
            </p>
          </div>
        </motion.div>

        {/* Profile Card Details */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            Personal Details
          </h2>

          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              <UserIcon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Full Name</p>
              <p style={{ margin: 0, fontSize: '1rem', color: '#111827', fontWeight: 500 }}>{fullName}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              <MailIcon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Email Address</p>
              <p style={{ margin: 0, fontSize: '1rem', color: '#111827', fontWeight: 500 }}>{user.email || 'N/A'}</p>
            </div>
          </motion.div>

          {/* --- CONDITIONAL: STUDENT ID --- */}
          {/* Only display the Student ID field if the user role is 'student' */}
          {user.role === 'student' && (
            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                <IdCardIcon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Student ID</p>
                <p style={{ margin: 0, fontSize: '1rem', color: '#111827', fontWeight: 500 }}>{user.studentId || 'Not Assigned'}</p>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
