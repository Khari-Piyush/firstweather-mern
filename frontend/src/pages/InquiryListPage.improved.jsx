import { Link } from "react-router-dom";
import { FaClipboardList, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useInquiryCart } from "../contexts/InquiryCartContext.improved.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Button.improved.jsx";
import {
  PageWrapper,
  Section,
  SectionLabel,
  PageHeading,
  BodyText,
} from "../components/Layout.improved.jsx";
import "./InquiryListPage.improved.css";

const optimizeImg = (url) =>
  url ? url.replace("/upload/", "/upload/w_200,f_auto,q_auto/") : null;

const InquiryListPage = () => {
  const { items, itemCount, updateQty, removeItem, clearCart } = useInquiryCart();

  return (
    <PageWrapper>
      <Section bg="var(--fw-white)">
        <SectionLabel>Request Quote List</SectionLabel>
        <PageHeading style={{ marginBottom: "var(--fw-space-3)" }}>
          Your Inquiry List
        </PageHeading>
        <BodyText style={{ maxWidth: "60ch" }}>
          Review the products you're interested in below. No prices are
          shown here &mdash; our team will get back to you with the best
          price for your selection.
        </BodyText>

        {items.length === 0 ? (
          <div className="fw-inquiry-list__empty">
            <FaClipboardList aria-hidden="true" />
            <p>Your inquiry list is empty.</p>
            <PrimaryButton to="/products">Browse Products</PrimaryButton>
          </div>
        ) : (
          <>
            <div className="fw-inquiry-list__items">
              {items.map((item) => (
                <div className="fw-inquiry-list__item" key={item.productId}>
                  <div className="fw-inquiry-list__item-main">
                    <img
                      className="fw-inquiry-list__item-img"
                      src={optimizeImg(item.imageUrl) || "/fw-logo-blue.webp"}
                      alt={item.name}
                      loading="lazy"
                    />

                    <div className="fw-inquiry-list__item-info">
                      <Link to={`/products/${item.productId}`} className="fw-inquiry-list__item-name">
                        {item.name}
                      </Link>
                      {(item.code || item.category) && (
                        <p className="fw-inquiry-list__item-meta">
                          {[item.code, item.category].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="fw-inquiry-list__item-price">Price on request</p>
                    </div>
                  </div>

                  <div className="fw-inquiry-list__item-actions">
                    <div className="fw-inquiry-list__qty">
                      <button
                        type="button"
                        className="fw-inquiry-list__qty-btn"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <FaMinus />
                      </button>
                      <span className="fw-inquiry-list__qty-value">{item.qty}</span>
                      <button
                        type="button"
                        className="fw-inquiry-list__qty-btn"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="fw-inquiry-list__remove"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from inquiry list`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="fw-inquiry-list__footer">
              <p className="fw-inquiry-list__count">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your list
              </p>
              <div className="fw-inquiry-list__actions">
                <SecondaryButton onClick={clearCart}>Clear All</SecondaryButton>
                <PrimaryButton to="/products">Add More Products</PrimaryButton>
              </div>
            </div>

            <div className="fw-inquiry-list__assist">
              <p>
                Ready to request a quote for this list? Our quote request
                form is launching soon. In the meantime, reach out via{" "}
                <Link to="/contact">Contact Us</Link> and our team will help
                with pricing and availability for everything on your list.
              </p>
            </div>
          </>
        )}
      </Section>
    </PageWrapper>
  );
};

export default InquiryListPage;
