export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SolutionCart. All rights reserved.</p>
      </div>
    </footer>
  );
}
