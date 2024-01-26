import {useCallback, useEffect, useState} from "react";
import {
    CLIENT_PRESENTATION_BASE_SQFT, CLIENT_PRESENTATION_SQFT_RATE,
    ClientPresentationBaseTimes,
    ContactTypes, DATA_COLLECTION_BASE_SQFT, DATA_COLLECTION_SQFT_RATE,
    DataCollectionBaseTimes,
    DwellingType, REPORT_WRITING_BASE_SQFT, REPORT_WRITING_SQFT_RATE,
    ReportWritingBaseTimes,
    RequesterTypes, ServiceTypeNames,
    ServiceTypes
} from '../constants/Appointment';
import getSlotPart from "../utils/getSlotPart";
import getTimeSlots from "../utils/getTimeSlots";

const DEFAULT_CONTACT_INFO = {
    firstName: '',
    lastName: '',
    email: ''
};

const DEFAULT_SLOT_LENGTH = {hours: 2};

const useAppointment = () => {

    // Service Selection
    const [requester, setRequester] = useState(RequesterTypes.BUYER);
    const [serviceType, setServiceType] = useState(ServiceTypeNames.BUYERS_INSPECTION);
    const [additionalServices, setAdditionalServices] = useState([]);

    // Property Details
    const [dwellingType, setDwellingType] = useState(DwellingType.CONDO);
    const [address, setAddress] = useState('');
    const [unit, setUnit] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [dwellingSize, setDwellingSize] = useState(0);

    // Contact Information
    const [contactInfo, setContactInfo] = useState({
        [ContactTypes.CLIENT]: {...DEFAULT_CONTACT_INFO},
        [ContactTypes.AGENT]: {...DEFAULT_CONTACT_INFO},
        [ContactTypes.ANOTHER_CLIENT]: {...DEFAULT_CONTACT_INFO},
        [ContactTypes.TRANSACTION_MANAGER]: {...DEFAULT_CONTACT_INFO},
        [ContactTypes.SELLER]: {...DEFAULT_CONTACT_INFO},
    });

    // Schedule
    const [inspectorTimeSlot, setInspectorTimeSlot] = useState('');
    const [clientTimeSlot, setClientTimeSlot] = useState('');
    const [day, setDay] = useState('');
    const [minimizeInspectionTime, setMinimizeInspectionTime] = useState(false);
    const [additionalPresentationTime, setAdditionalPresentationTime] = useState(false);

    const [selectedTimeSlotPair, setSelectedTimeSlotPair] = useState();
    const [timeSlots, setTimeSlots] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState({
        dataCollectionLength: { minutes: 0 },
        reportWritingLength: { minutes: 0 },
        clientPresentationLength: { minutes: 0 },
        appointmentLength: { minutes: DEFAULT_SLOT_LENGTH }
    })

    useEffect(() => {
        const { appointmentParts } = ServiceTypes[serviceType];
        const onsiteLength = appointmentParts.reduce((acc, partType) => {

            const slotPart = getSlotPart(dwellingSize, partType, serviceType);
            acc.appointmentLength.minutes += slotPart;
            acc[`${partType}Length`] = { minutes: slotPart };

            return acc;
        }, { appointmentLength: { minutes: 0 }})

        setAppointmentDetails(onsiteLength);

        console.log(onsiteLength);

    }, [serviceType, dwellingSize]);

    useEffect(() => {
        setTimeSlots(getTimeSlots(day, {
            startTime: [7, 0],
            endTime: [21, 0],
            appointmentDetails
        }))
    }, [day, appointmentDetails]);

    const getInspectorTimeSlot = useCallback(inspectorTimeStart => {
        return timeSlots.find(({inspectorAppointment}) => inspectorAppointment.startLabel === inspectorTimeStart);
    }, [timeSlots]);

    const getClientTimeSlot = useCallback(clientTimeStart => {
        return timeSlots.find(({clientAppointment}) => clientAppointment.startLabel === clientTimeStart);
    }, [timeSlots]);

    const setTimeSlot = useCallback(({inspectorStart, clientStart}) => {
        const timeSlotPair = inspectorStart
            ? getInspectorTimeSlot(inspectorStart)
            : getClientTimeSlot(clientStart)

        setSelectedTimeSlotPair(timeSlotPair);
        setInspectorTimeSlot(timeSlotPair.inspectorAppointment.startLabel)
        setClientTimeSlot(timeSlotPair.clientAppointment.startLabel);
    }, [inspectorTimeSlot, clientTimeSlot, timeSlots]);

    const resetTimeSlot = () => {
        setSelectedTimeSlotPair(null);
        setInspectorTimeSlot('');
        setClientTimeSlot('');
    }

    return {
        address,
        additionalServices,
        additionalPresentationTime,
        city,
        clientTimeSlot,
        contactInfo,
        day,
        dwellingSize,
        dwellingType,
        inspectorTimeSlot,
        minimizeInspectionTime,
        requester,
        selectedTimeSlotPair,
        serviceType,
        state,
        timeSlots,
        unit,
        zipCode,
        resetTimeSlot,
        setAddress,
        setAdditionalServices,
        setAdditionalPresentationTime,
        setCity,
        setClientTimeSlot,
        setContactInfo,
        setDay,
        setDwellingSize,
        setDwellingType,
        setInspectorTimeSlot,
        setMinimizeInspectionTime,
        setRequester,
        setServiceType,
        setState,
        setTimeSlot,
        setUnit,
        setZipCode
    }
}

export default useAppointment;
