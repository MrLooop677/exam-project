import { useNavigate } from "react-router-dom";
import Footer from "../layout/footer";
import Header from "../layout/header";

const Home = () => {
  const router = useNavigate();
  return (
    <div className="home-wrapper">
      <Header
        leftChildren={
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/about">Contact Us</a>
            </li>
          </ul>
        }
        rightChildren={
          <div
            className="
        flex
        gap-4
        "
          >
            <button className="login-btn" onClick={() => router("/pre-login")}>
              Login
            </button>

            <div className="header-circle"></div>
          </div>
        }
      />

      <div className="our-platform">
        <div className="left">
          <div className="left-upper">
            <img src="/assets/home/highlight.svg" alt="" />
            <div className="content">
              <p className="title">WORDS ABOUT OUR PLATFORM</p>
              <p className="sub-title">Subtitle here</p>
            </div>
          </div>
          <div className="left-bottom">
            <img src="/assets/home/Intersect.svg" alt="" />
          </div>
        </div>
        <div className="right-img">
          <img src="/assets/home/platform.svg" alt="" />
        </div>
      </div>

      <div className="who-are-we-wrapper">
        <div className=" first-card">
          <div className=" who-we-upper">
            <p>Who WE Are?</p>
          </div>
          <div className=" section-card who-we-bottom">
            <img src="/assets/home/done.svg" alt="" />
          </div>
        </div>
        <div className="second-card">
          <div className=" section-card second-card-upper ">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. 
            </p>
          </div>
          <div className=" section-card second-card-bottom">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>

        {/* Third card - without flex column */}
        <div className="section-card third-card">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. 
          </p>
          <img src="/assets/home/team-brainstorming.svg" alt="" />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.{" "}
          </p>
        </div>

        {/* Fourth card */}
        <div className="fourth-card">
          <div className="section-card fourth-card-upper">
            <img src="/assets/home/high-five.svg" alt="" />
          </div>
          <div className=" section-card fourth-card-bottom">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="what-we-do-wrapper">
        <div className="left-side">
          <div className="img-background">
            <img src="/assets/home/certificate.svg" alt="" />
          </div>
          <div className="what-we-do-here what-we-do-upper">
            <img src="/assets/home/book.svg" alt="" />
            <p>what we do here</p>
          </div>
          <div className="what-we-do-here what-we-do-bottom">
            <img src="/assets/home/success.svg" alt="" />
            <p>what we do here</p>
          </div>
        </div>
        <div className="right-side">
          <p className="title">What WE DO?</p>
          <p className="subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. 
          </p>
        </div>
      </div>
      <div className="our-name-wrapper">
        <div className="our-name-main">
          <p className="title">Why “Our Name”?</p>
          <p className="subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. 
          </p>
        </div>
        <div className="bottom-img">
          <img src="/assets/home/gray-line.svg" alt="" />
          <img
            src="/assets/home/graduation.svg"
            alt=""
            className="graduation-img"
          />
        </div>
      </div>
      <div className="products-we-deliver-wrapper">
        <div className="products-we-deliver-main-content">
          <div className="products-we-deliver-main">
            <p className="title">Main Title</p>
            <p className="subtitle">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          <div className="products-we-deliver-main">
            <p className="title">Main Title</p>
            <p className="subtitle">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          <div className="products-we-deliver-main">
            <p className="title">Main Title</p>
            <p className="subtitle">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          <div className="products-we-deliver-main">
            <p className="title">Main Title</p>
            <p className="subtitle">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
        </div>
        <div className="title-circle">
          <p>Products we Deliver</p>
          <img src="/assets/home/lamp.svg" alt="" />
        </div>
      </div>
      <div className="documents-wrapper">
        <p className="documents-title">Documents About the Platform</p>
        <div className="document-download-main">
          <div className="document-download">
            <img src="/assets/home/book2.svg" alt="" className="book" />
            <p>Document Title</p>
            <img
              src="/assets/home/download.svg"
              alt=""
              className="download-img"
            />
          </div>
          <div className="document-download">
            <img src="/assets/home/book2.svg" alt="" className="book" />
            <p>Document Title</p>
            <img
              src="/assets/home/download.svg"
              alt=""
              className="download-img"
            />
          </div>
          <div className="document-download">
            <img src="/assets/home/book2.svg" alt="" className="book" />
            <p>Document Title</p>
            <img
              src="/assets/home/download.svg"
              alt=""
              className="download-img"
            />
          </div>
          <div className="document-download">
            <img src="/assets/home/book2.svg" alt="" className="book" />
            <p>Document Title</p>
            <img
              src="/assets/home/download.svg"
              alt=""
              className="download-img"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
