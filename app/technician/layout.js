import Footer from "@/components/Technician/Footer";
import Heading from "@/components/Technician/Heading";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Heading/>
          {children}
          <Footer/>
      </body>
    </html>
  );
}
