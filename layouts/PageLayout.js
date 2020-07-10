import Nav from "../components/Nav";

const PageLayout = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
};

export default PageLayout;
