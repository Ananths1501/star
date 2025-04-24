"use client"

import { useState, useEffect } from "react"
import { Plus, Users, Eye, Wrench, X, Edit, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "../../utils/api"

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false)
  const [showWorkersModal, setShowWorkersModal] = useState(false)
  const [showEditWorkerModal, setShowEditWorkerModal] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [currentWorker, setCurrentWorker] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/services")
      setServices(response.data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddService = () => {
    setShowAddServiceModal(true)
  }

  const handleAddWorker = () => {
    setShowAddWorkerModal(true)
  }

  const handleViewWorkers = (service) => {
    setCurrentService(service)
    setShowWorkersModal(true)
  }

  const handleEditWorker = (worker) => {
    setCurrentWorker(worker)
    setShowEditWorkerModal(true)
  }

  const handleCloseModal = () => {
    setShowAddServiceModal(false)
    setShowAddWorkerModal(false)
    setShowWorkersModal(false)
    setShowEditWorkerModal(false)
    setCurrentService(null)
    setCurrentWorker(null)
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service? This will also delete all associated workers.")) {
      try {
        await api.delete(`/services/${serviceId}`)
        fetchServices()
        toast.success("Service deleted successfully")
      } catch (error) {
        console.error("Error deleting service:", error)
        toast.error("Failed to delete service")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Service
          </button>
          <button
            onClick={handleAddWorker}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Users size={18} className="mr-1" /> Add Worker
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="bg-white   rounded-lg shadow p-8 text-center">
          <Wrench className="mx-auto text-gray-400 text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No services available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding a new service.</p>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white   rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg?height=200&width=300"}
                  alt={service.serviceType}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-3  dark:text-white">{service.serviceType}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {service.workers.length} Worker{service.workers.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewWorkers(service)}
                      className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center text-sm"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && <AddServiceModal onClose={handleCloseModal} onServiceAdded={fetchServices} />}

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <AddWorkerModal services={services} onClose={handleCloseModal} onWorkerAdded={fetchServices} />
      )}

      {/* View Workers Modal */}
      {showWorkersModal && currentService && (
        <ViewWorkersModal
          service={currentService}
          onClose={handleCloseModal}
          onEditWorker={handleEditWorker}
          onWorkersUpdated={fetchServices}
        />
      )}

      {/* Edit Worker Modal */}
      {showEditWorkerModal && currentWorker && (
        <EditWorkerModal
          worker={currentWorker}
          services={services}
          onClose={handleCloseModal}
          onWorkerUpdated={fetchServices}
        />
      )}
    </div>
  )
}

const AddServiceModal = ({ onClose, onServiceAdded }) => {
  const [serviceType, setServiceType] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!serviceType) {
      toast.error("Service type is required")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("serviceType", serviceType)
      formData.append("description", description)

      if (image) {
        formData.append("image", image)
      }

      await api.post("/services", formData)
      onServiceAdded()
      toast.success("Service added successfully")
    } catch (error) {
      console.error("Error adding service:", error)
      toast.error(error.response?.data?.message || "Failed to add service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white   rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type *</label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-32 object-contain" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
const AddWorkerModal = ({ services, onClose, onWorkerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    feesPerDay: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.serviceType || !formData.feesPerDay) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      if (image) {
        formDataObj.append("image", image);
      }

      await api.post("/services/workers", formDataObj);
      onWorkerAdded();
      toast.success("Worker added successfully");
    } catch (error) {
      console.error("Error adding worker:", error);
      toast.error(error.response?.data?.message || "Failed to add worker");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Worker</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Service Type</option>
              {services.map((service) => (
                <option key={service._id} value={service.serviceType}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fees Per Day (₹) *
            </label>
            <input
              type="number"
              name="feesPerDay"
              value={formData.feesPerDay}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {previewUrl && (
              <div className="mt-3">
                <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-md border" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition-transform shadow-md disabled:opacity-70"
            >
              {isLoading ? "Adding..." : "Add Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ViewWorkersModal = ({ service, onClose, onEditWorker, onWorkersUpdated }) => {
  const [workers, setWorkers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await api.get(`/services/${service._id}/workers`)
        setWorkers(response.data)
      } catch (error) {
        console.error("Error fetching workers:", error)
        toast.error("Failed to load workers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkers()
  }, [service._id])

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        await api.delete(`/services/workers/${workerId}`)
        setWorkers(workers.filter((worker) => worker._id !== workerId))
        toast.success("Worker deleted successfully")
        onWorkersUpdated()
      } catch (error) {
        console.error("Error deleting worker:", error)
        toast.error("Failed to delete worker")
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white   rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{service.serviceType} Workers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : workers.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">No workers available for this service.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workers.map((worker) => (
                <div key={worker._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex">
                  <img
                    src={worker.image || "/placeholder.svg?height=80&width=80"}
                    alt={worker.name}
                    className="w-20 h-20 object-cover rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{worker.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {worker.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fees: ₹{worker.feesPerDay}/day</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{worker.address}</p>
                    <div className="flex mt-2 gap-2">
                      <button
                        onClick={() => onEditWorker(worker)}
                        className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-xs"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWorker(worker._id)}
                        className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center text-xs"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const EditWorkerModal = ({ worker, services, onClose, onWorkerUpdated }) => {
  const [formData, setFormData] = useState({
    name: worker.name,
    phone: worker.phone,
    address: worker.address,
    serviceType: worker.serviceType,
    feesPerDay: worker.feesPerDay,
    status: worker.status || "Available",
  })
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(worker.image)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address || !formData.serviceType || !formData.feesPerDay) {
      toast.error("Please fill all required fields")
      return
    }

    setIsLoading(true)

    try {
      const formDataObj = new FormData()
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key])
      })

      if (image) {
        formDataObj.append("image", image)
      }

      await api.put(`/services/workers/${worker._id}`, formDataObj)
      onWorkerUpdated()
      toast.success("Worker updated successfully")
    } catch (error) {
      console.error("Error updating worker:", error)
      toast.error(error.response?.data?.message || "Failed to update worker")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white   rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Worker</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Service Type</option>
              {services.map((service) => (
                <option key={service._id} value={service.serviceType}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fees Per Day (₹) *
            </label>
            <input
              type="number"
              name="feesPerDay"
              value={formData.feesPerDay}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Image</label>
            <img
              src={previewUrl || worker.image || "/placeholder.svg?height=100&width=100"}
              alt={worker.name}
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2">
              Change Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Updating..." : "Update Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminServices
