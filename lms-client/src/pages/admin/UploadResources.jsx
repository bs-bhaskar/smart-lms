// import React from 'react';
// import { useState } from 'react';
// import Loader from '../../components/shared/Loader';

// export default function UploadResources() {
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = e => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccess('');
//     setError('');
//     setTimeout(() => {
//       setLoading(false);
//       setSuccess('Resource uploaded!');
//     }, 1000);
//   };

//   return loading ? <Loader /> : (
//     <div className="max-w-xl mx-auto mt-8">
//       <h1 className="text-2xl font-bold text-orange mb-6">Upload Resources</h1>
//       <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
//         <input type="file" onChange={e => setFile(e.target.files[0])} className="border rounded px-3 py-2" />
//         {error && <div className="text-red-600 text-sm">{error}</div>}
//         {success && <div className="text-green-600 text-sm">{success}</div>}
//         <button type="submit" className="bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition">Upload</button>
//       </form>
//     </div>
//   );
// } 
////////////////////////////----------RESPONSIVE DESIGN-----------------///////////////////////////
import React from 'react';
import { useState } from 'react';
import Loader from '../../components/shared/Loader';

export default function UploadResources() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess('Resource uploaded!');
    }, 1000);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
        Upload Resources
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col gap-4"
      >

        {/* File Input */}
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="border rounded px-3 py-2 w-full min-w-0 text-sm sm:text-base"
        />

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm break-words">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="text-green-600 text-sm break-words">
            {success}
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          className="bg-orange text-white font-semibold py-2 px-4 rounded hover:bg-orange-dark transition w-full"
        >
          Upload
        </button>

      </form>
    </div>
  );
}