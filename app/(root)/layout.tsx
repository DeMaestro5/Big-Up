import MobileNav from '@/components/share/MobileNav';
import Sidebar from '@/components/share/Sidebar';
import { Toaster } from '@/components/ui/toaster';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='root'>
      <Sidebar />
      <MobileNav />

      <div className='root-container'>
        <div className='wrapper'>{children}</div>
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
