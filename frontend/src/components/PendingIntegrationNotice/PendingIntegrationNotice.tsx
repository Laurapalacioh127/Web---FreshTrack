export const PendingIntegrationNotice = ({ message }: { message: string }) => (
  <p role="note" className="rounded-xl bg-sun/60 px-4 py-3 text-xs font-medium">
    🚧 {message}
  </p>
)