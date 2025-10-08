'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import api from '@/lib/api';
import FormField from '@/utils/FormField';
import Link from 'next/link';

export default function BookingForm({
  guestInfo,
  user,
  onGuestInfoChange,
  bookingData
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onGuestInfoChange({
      ...guestInfo,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, guestInfo[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]*$/.test(value.trim())) {
          error = 'Name can only contain letters and spaces';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9+-\s()]{10,15}$/.test(value.trim())) {
          error = 'Please enter a valid phone number (10-15 digits)';
        } else if (!/^\d+$/.test(value.replace(/[\s+()-]/g, ''))) {
          error = 'Phone number can only contain numbers and valid symbols';
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'specialRequests':
        if (value.length > 500) {
          error = 'Special requests cannot exceed 500 characters';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate required fields
    if (!guestInfo.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (guestInfo.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9+-\s()]{10,15}$/.test(guestInfo.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Validate email if provided
    if (guestInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate special requests length
    if (guestInfo.specialRequests.length > 500) {
      newErrors.specialRequests = 'Special requests cannot exceed 500 characters';
      isValid = false;
    }

    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    setTouched({
      name: true,
      phone: true,
      email: true,
      specialRequests: true
    });

    return isValid;
  };



  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Build payload according to your backend expectations
    const payload = {
    
      order_date: new Date().toISOString().split("T")[0],
      customerid: user?.id || null,
      customer_name: guestInfo.name.trim(),
      mobile_no: formatPhoneNumber(guestInfo.phone),
      email: guestInfo.email?.trim() || "",
      order_status: "pending",
      payment_status: "unpaid",
      property_id: bookingData.property.id,
      service_category_id: 6,  // or whichever ID corresponds to "activities"

      // Activity detail(s)
      package_id: bookingData.cart_session.item_id,
      package_name: bookingData.package.name,
      base_price: bookingData.package.base_price,
      discount_percent: bookingData.package.discount_percent,
      discount_amount: bookingData.package.discount_amount,
      final_price: bookingData.package.final_price,
      activity_date: bookingData.cart_session.date,
      activity_time: new Date(bookingData.cart_session.time).toTimeString().split(' ')[0],
      total_guests: bookingData.cart_session.total_guest,
      pickup_location: bookingData.cart_session.pickup_location,
      special_requests: guestInfo.specialRequests?.trim() || "",
    };

    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/AcrivityOrderStore`,
        payload
      );

      if (response.status === 201 || response.status === 200) {
       
        const orderNumber = response.data.data.booking_order.orderno;
        router.push(`/confirmation?orderno=${orderNumber}`);
      } else {
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error 
        || 'An error occurred while confirming your booking. Please try again.';
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  const isFieldValid = (fieldName) => {
    return !errors[fieldName] || !touched[fieldName];
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Guest Information
        {user && (
          <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Pre-filled from your profile
          </span>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <FormField
            label="Full Name *"
            id="name"
            name="name"
            type="text"
            value={guestInfo.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            helperText={user ? "Your account name is pre-filled, you can change it." : ""}
            placeholder="Enter your full name"
            error={getFieldError('name')}
            isValid={isFieldValid('name')}
          />
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        <div>
          <FormField
            label="Phone Number *"
            id="phone"
            name="phone"
            type="tel"
            value={guestInfo.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            helperText={user && user.phone ? "Your account phone is pre-filled." : ""}
            placeholder="Enter your phone number (e.g., 0123456789)"
            error={getFieldError('phone')}
            isValid={isFieldValid('phone')}
          />
          {getFieldError('phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
          )}
        </div>

        <div>
          <FormField
            label="Email Address (Optional)"
            id="email"
            name="email"
            type="email"
            value={guestInfo.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            helperText={user ? "Your account email is pre-filled." : "We'll send your booking confirmation to this email"}
            placeholder="Enter your email address"
            error={getFieldError('email')}
            isValid={isFieldValid('email')}
          />
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Special Requests
            <span className="text-xs text-gray-500 ml-1">
              ({guestInfo.specialRequests.length}/500 characters)
            </span>
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={4}
            value={guestInfo.specialRequests}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              getFieldError('specialRequests') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
            placeholder="Any special requests or notes for your activity booking..."
          />
          {getFieldError('specialRequests') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('specialRequests')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Let us know if you have any special requirements or requests
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: 'linear-gradient(90deg, #313881, #0678B4)',
            }}
            className="w-full text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isSubmitting
              ? 'Processing Your Booking...'
              : `Confirm Booking - ৳${bookingData.package.final_price}`}
            <i className="fa-solid fa-check ml-2"></i>
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            By confirming, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              terms and conditions
            </Link>
          </p>
        </div>
      </form>

      {/* Validation Summary (optional) */}
      {Object.keys(errors).some(key => errors[key]) && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, error]) => 
              error && (
                <li key={field}>
                  {field === 'name' && 'Full Name: '}
                  {field === 'phone' && 'Phone Number: '}
                  {field === 'email' && 'Email: '}
                  {field === 'specialRequests' && 'Special Requests: '}
                  {error}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}