// RequestContext.jsx
import React, { createContext, useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "sonner";
import useFetch from "./hooks/UseFetch";

const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const socketRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const fetchRequests = async () => {
    const res = await axios.get(`${apiUrl}/v1/service-requests`);
    console.log(res);
    const items = res.data.items.map((item) => {
      const date = new Date(item.created_at);
      const formatted = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      return {
        date: formatted,
        request_id: item.id,
        request_status: item.status,
        request_type: item.type,
        company: item.asset.company_name,
        requester: item.client.name,
        device_model: item.asset.model,
        description: item.description_preview,
      };
    });
    return items;
  };

  const { data: requests, loading, error, fn: fetchData } = useFetch(fetchRequests);
  const [localRequests, setLocalRequests] = useState([]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Sync fetched requests into our localRequests state
  useEffect(() => {
    if (requests) setLocalRequests(requests);
  }, [requests]);

  // WebSocket setup and cleanup
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(apiUrl, {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsSocketConnected(true);
      
      // Join global room to receive all updates
      socket.emit('joinRoom', 'global', (response) => {
        console.log('📡 Joined global room:', response);
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsSocketConnected(false);
    });

    // Listen for service request updates
    socket.on('service-request.updated', (data) => {
      console.log('🔔 Service request updated:', data);
      
      // This is where you'll handle the update
      handleServiceRequestUpdate(data);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array - only run once

  const handleServiceRequestUpdate = async (updateData) => {
    // updateData structure from backend:
    // { serviceRequestId, status, type, createdAt } for new requests
    // { serviceRequestId, status, technician_id?, updated_at } for updates
    
    // Extract the ID - could be either 'id' or 'serviceRequestId' depending on event type
    const requestId = updateData.id || updateData.serviceRequestId;
    
    if (!requestId) {
      console.error('No request ID found in update data:', updateData);
      return;
    }
    
    try {
      // Fetch the full details of the updated/new service request
      const res = await axios.get(`${apiUrl}/v1/service-requests/${requestId}`);
      const item = res.data;
      
      console.log(res);

      const date = new Date(item.created_at);
      const formatted = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      
      const formattedRequest = {
        date: formatted,
        request_id: item.id,
        request_status: item.status,
        request_type: item.type,
        company: item.asset.company_name,
        requester: item.client.name,
        device_model: item.asset.model,
        description: item.description,
      };

      setLocalRequests((prev) => {
        // Check if request already exists (update case)
        const existingIndex = prev.findIndex(r => r.request_id === requestId);
        
        if (existingIndex !== -1) {
          // Update existing request
          const updated = [...prev];
          updated[existingIndex] = formattedRequest;
          

          console.log(formattedRequest);
          // Show update notification
          toast("Service Request Updated", {
            description: `${formattedRequest.request_type} - ${formattedRequest.device_model}`,
            action: {
              label: "Dismiss",
              onClick: () => {},
            },
          });
          
          return updated;
        } else {
          // New request - add to the beginning
          
          // Show new request notification
          toast("New Service Request", {
            description: `${formattedRequest.request_type} from ${formattedRequest.requester} - ${formattedRequest.device_model}`,
            action: {
              label: "Close",
              onClick: () => {
                // You can add navigation logic here if needed
                console.log("View request:", formattedRequest.request_id);
              },
            },
          });
          
          return [formattedRequest, ...prev];
        }
      });
      
    } catch (err) {
      console.error('Failed to fetch updated service request:', err);
    }
  };

  const handleAppRequest = (newRequestData) => {
    setLocalRequests((prev) => [...prev, newRequestData]);
  };

  if (loading) return <p>Loading device info...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <RequestContext.Provider 
      value={{ 
        requests: localRequests, 
        handleAppRequest,
        isSocketConnected, // Expose connection status
        socketRef // Expose socket if you need manual control elsewhere
      }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestState = () => useContext(RequestContext);

export default RequestProvider;