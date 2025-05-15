import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectById } from "@/lib/actions/project-actions"
import { getInventories } from "@/lib/actions/inventory-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Building, Edit } from "lucide-react"
import ProjectActions from "@/components/project-actions"

export async function generateMetadata({ params }) {
  const { data: project } = await getProjectById(params.id)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.name} | Project`,
    description: `Details for project ${project.name}`,
  }
}

export default async function ProjectDetailPage({ params }) {
  const { data: project } = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  // Get inventory items for this project
  const { data: inventories = [] } = await getInventories(params.id)

  // Calculate financial summary
  const totalCost = (project.costOfPurchase || 0) + (project.costOfInstallation || 0)
  const profit = (project.customerCharge || 0) - totalCost
  const profitMargin = totalCost > 0 ? (profit / project.customerCharge) * 100 : 0

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.projectId}</p>
          </div>
        </div>

        <div className="flex mt-4 md:mt-0 space-x-4">
          <Link href={`/projects/${project._id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <ProjectActions projectId={project._id} currentStatus={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                project.status === "Completed"
                  ? "success"
                  : project.status === "In Progress"
                    ? "default"
                    : project.status === "Planning"
                      ? "secondary"
                      : project.status === "On Hold"
                        ? "warning"
                        : "destructive"
              }
              className="text-base py-1 px-3"
            >
              {project.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{project.location}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{project.supplier === "Other" ? project.otherSupplier : project.supplier}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{project.customerContact?.name || "—"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Number of Stops</dt>
                <dd className="mt-1">{project.numberOfStops}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Shaft Dimensions</dt>
                <dd className="mt-1">
                  {project.shaftWidth} × {project.shaftDepth} mm
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Pit Depth</dt>
                <dd className="mt-1">{project.pitDepth} mm</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Reference</dt>
                <dd className="mt-1">{project.reference || "—"}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Stop Heights</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Floor</TableHead>
                      <TableHead>Height (mm)</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.stops &&
                      project.stops.map((stop, index) => (
                        <TableRow key={index}>
                          <TableCell>{stop.floorNumber}</TableCell>
                          <TableCell>{stop.height}</TableCell>
                          <TableCell>{stop.description || `Floor ${stop.floorNumber}`}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Cost of Purchase</dt>
                <dd className="mt-1">${project.costOfPurchase?.toLocaleString() || "0"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Cost of Installation</dt>
                <dd className="mt-1">${project.costOfInstallation?.toLocaleString() || "0"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Total Cost</dt>
                <dd className="mt-1">${totalCost.toLocaleString()}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Customer Charge</dt>
                <dd className="mt-1">${project.customerCharge?.toLocaleString() || "0"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Profit</dt>
                <dd className="mt-1 font-medium" style={{ color: profit >= 0 ? "green" : "red" }}>
                  ${profit.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Profit Margin</dt>
                <dd className="mt-1 font-medium" style={{ color: profit >= 0 ? "green" : "red" }}>
                  {profitMargin.toFixed(2)}%
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeline</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                  <dd className="mt-1">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Completion Date</dt>
                  <dd className="mt-1">
                    {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            {project.customerContact ? (
              <dl className="grid grid-cols-1 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="mt-1">{project.customerContact.name}</dd>
                </div>

                {project.customerContact.email && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1">
                      <a href={`mailto:${project.customerContact.email}`} className="text-primary hover:underline">
                        {project.customerContact.email}
                      </a>
                    </dd>
                  </div>
                )}

                {project.customerContact.phone && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                    <dd className="mt-1">
                      <a href={`tel:${project.customerContact.phone}`} className="text-primary hover:underline">
                        {project.customerContact.phone}
                      </a>
                    </dd>
                  </div>
                )}

                {project.customerContact.address && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                    <dd className="mt-1">{project.customerContact.address}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No customer information available.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Assigned Team</CardTitle>
              <Link href={`/projects/${project._id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit Team
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {project.assignedUsers && project.assignedUsers.length > 0 ? (
              <div className="space-y-4">
                {project.assignedUsers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No team members assigned to this project.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Project Inventory</CardTitle>
            <Link href="/inventory/create">
              <Button variant="outline" size="sm">
                Add Inventory
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {inventories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date Supplied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventories.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.inventoryId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{new Date(item.dateSupplied).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Available"
                            ? "success"
                            : item.status === "Low Stock"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.assignedTo ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/inventory/${item._id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No inventory items associated with this project.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
