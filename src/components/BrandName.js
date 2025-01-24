import { useAuth } from '../context/AuthContext';

function BrandName() {
  const { user } = useAuth();
  const displayName = user?.displayName;
  
  // If no display name is set, show a message to update profile
  if (!displayName) {
    return (
      <span className="brand-name">
        <span className="update-profile-hint">Update Profile</span>Verse
      </span>
    );
  }
  
  return (
    <span className="brand-name">
      {displayName}Verse
    </span>
  );
}

export default BrandName; 