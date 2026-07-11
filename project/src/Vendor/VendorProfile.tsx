import { useAuth } from '../context/AuthContext';
import { Store, Phone, FileText, Building2 } from 'lucide-react';

export default function VendorProfile() {
  const { user } = useAuth() as any;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Store className="text-zomato-red" /> Restaurant Profile
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Business / Restaurant Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">{user?.businessName || 'Not Provided'}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Owner Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white font-medium">{user?.ownerName || user?.name || 'Not Provided'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Registered Phone</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">{user?.number || 'Not Provided'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">GST Number</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">{user?.gstNumber || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}