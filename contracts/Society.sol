pragma solidity ^0.4.23;


contract Society{

	struct Coupon{
		uint id;
		uint startDate;
		uint endDate;
	}

	struct Member{
		uint id;
		string name;
		address addr;
		uint CouponsCount;
		mapping(uint => Coupon) Coupons;
	}

	mapping(uint => Member) public Members;
	uint public AllMembersCount = 0; 
	//mapping(Member => mapping(uint => Coupon)) Coupons;
	

//get function
    function getMemberCouponID(uint ID, uint count) public returns(uint){
    	return Members[ID].Coupons[count].id;
    	
    }

    function getMemberCouponEndDate(uint ID, uint count) public returns(uint){
    	return Members[ID].Coupons[count].endDate;
    }

    function addMember(string _name, address _addr) private{
    	Members[AllMembersCount] = Member(AllMembersCount, _name, _addr, 0);
    	AllMembersCount++;
    }

	function addCoupon(uint ID, uint _startDate) private{
		require(ID < AllMembersCount);
		uint _endDate = _startDate + 10000;
		Members[ID].Coupons[Members[ID].CouponsCount] = Coupon(Members[ID].CouponsCount, _startDate, _endDate);
		Members[ID].CouponsCount++;
	}

	//check if some coupons outdated
	//helper function
	function updateCoupon(uint ID, uint _date) public{
		for(uint i = 0; i < Members[ID].CouponsCount; i++){
			if(Members[ID].Coupons[i].endDate < _date){
				delete Members[ID].Coupons[i];
				for(uint j = i+1; j <Members[ID].CouponsCount; j++){
					Members[ID].Coupons[j-1] = Members[ID].Coupons[j];
				}
				Members[ID].CouponsCount--;
			}
		}
	}

	    //helper function
    function isMember(address _addr) public returns(bool) {
    	for(uint i = 0; i < AllMembersCount; i++){
    		if(Members[i].addr == _addr)
    		   return true;
    	}
    	return false;
    }
    //helper function
    function MemberID(address _addr) public returns(uint) {
    	uint i = 0;
    	for(; i < AllMembersCount; i++){
    		if(Members[i].addr == _addr)
    		   return i;
    	}
    	return i;
    }

	//_number: number of coupons going to be used
	function spendCoupon(uint _number,uint _date) public{
		require(isMember(msg.sender));
		uint _id = MemberID(msg.sender);
		updateCoupon(_id,_date);
		require(Members[_id].CouponsCount >= _number);
		for(uint i = Members[_id].CouponsCount - 1; i > Members[_id].CouponsCount - _number - 1; --i){
			delete Members[_id].Coupons[i];
		}
		Members[_id].CouponsCount-=_number;
	}

	function transferCoupon(uint toID, uint _number, uint _date) public{
		require(isMember(msg.sender));
		require(toID <= AllMembersCount);
		uint _id = MemberID(msg.sender);
		updateCoupon(_id,_date);
		require(Members[_id].CouponsCount >= _number);
		for(uint i = Members[_id].CouponsCount - 1; i > Members[_id].CouponsCount - _number - 1; --i){
			delete Members[_id].Coupons[i];
		}
		Members[_id].CouponsCount-=_number;
		for(uint j = Members[toID].CouponsCount; j < Members[toID].CouponsCount + _number; ++j){
			Members[toID].Coupons[Members[toID].CouponsCount] = Coupon(Members[toID].CouponsCount, _date, _date + 10000);
	 	}
		Members[toID].CouponsCount+=_number;

	}
	function Society() public{
		//fill in the addresses
		addMember("John",0xea8416B2275bE20eF4EB2CCBd729d03c5eFd9E44);
		addMember("Sarah",0x06Ee30dB3055De76f3D6Cc675e1caCbfB9e476B1);
		addCoupon(0,20191026);
		addCoupon(1,20191026);
	}
}
