import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <h3 style={{ marginBottom: 8 }}>Page not found</h3>
      <Link href="/dashboard" className="btn">
        Back to dashboard
      </Link>
    </div>
  );
}