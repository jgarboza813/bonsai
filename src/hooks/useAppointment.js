import {useCallback, useEffect, useState} from "react";
import {
    CLIENT_PRESENTATION_BASE_SQFT, CLIENT_PRESENTATION_SQFT_RATE,
    ClientPresentationBaseTimes,
    ContactTypes, DATA_COLLECTION_BASE_SQFT, DATA_COLLECTION_SQFT_RATE,
    DataCollectionBaseTimes,
    DwellingType, REPORT_WRITING_BASE_SQFT, REPORT_WRITING_SQFT_RATE,
    ReportWritingBaseTimes,
    RequesterTypes,
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
    const [serviceType, setServiceType] = useState(ServiceTypes.BUYERS_INSPECTION);
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
    const [slotLength, setSlotLength] = useState(DEFAULT_SLOT_LENGTH)

    useEffect(() => {
        const dataCollectionTime = getSlotPart(dwellingSize, serviceType, DataCollectionBaseTimes, DATA_COLLECTION_BASE_SQFT, DATA_COLLECTION_SQFT_RATE);
        const reportWritingTime = getSlotPart(dwellingSize, serviceType, ReportWritingBaseTimes, REPORT_WRITING_BASE_SQFT, REPORT_WRITING_SQFT_RATE);
        const clientPresentationTime = getSlotPart(dwellingSize, serviceType, ClientPresentationBaseTimes, CLIENT_PRESENTATION_BASE_SQFT, CLIENT_PRESENTATION_SQFT_RATE);

        const slotLength = dataCollectionTime + reportWritingTime + clientPresentationTime;

        console.log(`Calculated slotLength: ${slotLength}`);

        setSlotLength({ minutes: slotLength })
    }, [serviceType, dwellingSize]);

    useEffect(() => {
        setTimeSlots(getTimeSlots(day, {
            startTime: [7, 0],
            endTime: [21, 0],
            slotLength
        }))
    }, [day, slotLength]);

    const getInspectorTimeSlot = useCallback(inspectorTimeStart => {
        return timeSlots.find(({inspectorSlot}) => inspectorSlot.startLabel === inspectorTimeStart);
    }, [timeSlots]);

    const getClientTimeSlot = useCallback(clientTimeStart => {
        return timeSlots.find(({clientSlot}) => clientSlot.startLabel === clientTimeStart);
    }, [timeSlots]);

    const setTimeSlot = useCallback(({inspectorStart, clientStart}) => {
        const timeSlotPair = inspectorStart
            ? getInspectorTimeSlot(inspectorStart)
            : getClientTimeSlot(clientStart)

        setSelectedTimeSlotPair(timeSlotPair);
        setInspectorTimeSlot(timeSlotPair.inspectorSlot.startLabel)
        setClientTimeSlot(timeSlotPair.clientSlot.startLabel);
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
