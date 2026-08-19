// M6: Health check endpoint for k8s/load balancer probes
export async function GET() {
  return Response.json({ status: "healthy", timestamp: new Date().toISOString() });
}